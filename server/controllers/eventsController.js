const Events = require('../models/events'); // Assuming this is the correct path
const { infoLogger, errorLogger } = require("../logs/logs");
const User = require('../models/users'); // Assuming you're storing user data here

exports.eventsController = {
    async addEvent(req, res) {
        try {
          const user = await User.findById(req.userId);
          if (!user) {
            return res.status(403).json({ message: "Unauthorized" });
          }
      
          const { callType, city, street, houseNumber, description,status } = req.body;
      
          // Validation (basic server-side)
          if (!callType || !city || !street || !description ||!status) {
            return res.status(400).json({ message: "Missing required fields" });
          }
      
          const costumerdetails = [
            `Name: ${user.name}`,
            `Age: ${user.age}`,
            `Gender: ${user.gender}`
          ];
      
          const newEvent = new Events({
            callType,
            city,
            street,
            houseNumber: houseNumber || 0,
            description,
            costumerdetails, // 🧠 This will be stored as an array of strings
            status
            // callID and date will be set automatically
          });
      
          const savedEvent = await newEvent.save();

          user.userCalls = user.userCalls || [];
          user.userCalls.push(newEvent.callID);
          await user.save();
          return res.status(201).json({ message: "Event created successfully", event: savedEvent });
        } catch (err) {
          console.error("❌ Error creating event:", err);
          return res.status(500).json({ message: "Internal server error", error: err.message });
        }
    },

    async getEvents(req, res) {
        try {
            const events = await Events.find({}).sort({ date: -1 }); 
            res.json(events);   
            infoLogger.info("Fetched all Calls");
        } catch (err) {
            errorLogger.error(`Error fetching Calls: ${err}`);
            res.status(500).json({ "message": "Error fetching Calls", error: err });
        }
    }
    ,    

    async getEventsByType(req, res) {
        try {
            
            const events = await Events.find({ callType: req.params.callType });
    
            if (events.length > 0) {
                res.json(events);
            } else {
                errorLogger.error(`No events found for call type: ${req.params.callType}`);
                res.status(404).json({ message: "No calls found for this type" });
            }
        } catch (err) {
            errorLogger.error(`Error fetching calls by type: ${err}`);
            res.status(500).json({ message: "Error fetching calls", error: err });
        }
    },
    async updateEvent(req, res) {
        const { callID: eventId } = req.params;
        const { callType, city, street, houseNumber, description, status } = req.body;
    
        try {
            const eventToUpdate = await Events.findOne({ callID: eventId });  // <-- fixed here
    
            if (!eventToUpdate) {
                errorLogger.error(`Call not found: ${eventId}`);
                return res.status(404).json({ message: "Call not found" });
            }
    
            // Update only allowed fields
            eventToUpdate.callType = callType;
            eventToUpdate.city = city;
            eventToUpdate.street = street;
            eventToUpdate.houseNumber = houseNumber;
            eventToUpdate.description = description;
            eventToUpdate.status = status;
    
            await eventToUpdate.save();
    
            infoLogger.info(`Call updated successfully: ${eventId}`);
            res.json({ message: "Call updated successfully", event: eventToUpdate });
    
        } catch (err) {
            errorLogger.error(`Error updating Call: ${err}`);
            res.status(500).json({ message: "Error updating Call", error: err });
        }
    },
    async deleteEvent(req, res) {
        try {
            const result = await Events.deleteOne({ callID: req.params.id });
            if (result.deletedCount > 0) {
                infoLogger.info(`Event deleted successfully: ${req.params.id}`);
                res.json({ "message": "Event deleted successfully" });
            } else {
                errorLogger.error(`Event not found: ${req.params.id}`);
                res.status(404).json({ "message": "Event not found" });
            }
        } catch (err) {
            errorLogger.error(`Error deleting event: ${err}`);
            res.status(500).json({ "message": "Error deleting event", error: err });
        }
    },
    async getLocationDetails(req, res) {
        try {
            const { lat, lng } = req.body;
            if (!lat || !lng) {
            return res.status(400).json({ message: "Missing coordinates" });
            }

            const [heData, enData] = await Promise.all([
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=20&addressdetails=1&extratags=1&namedetails=1`).then(r => r.json()),
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=20&addressdetails=1&extratags=1&namedetails=1`).then(r => r.json())
            ]);

            const extract = (data) => {
            const a = data.address;
            const city = a.city || a.town || a.village || a.state_district || a.state ;
            const street = a.road || a.street || a.pedestrian || a.footway || a.neighbourhood || "";
            const houseNumber = a.house_number || a.housenumber || "";
            console.log("🧭 Address Fields:", a);

            return { city, street, houseNumber };
            };

            const he = extract(heData);
            const en = extract(enData);

            const fullCity = `${he.city}, ${heData.address.country} | ${en.city}, ${enData.address.country}`;
            const finalStreet = (he.street && he.street.trim())  ? he.street
            : (en.street && en.street.trim()) ? en.street
            : "";
            const finalHouseNumber = he.houseNumber || en.houseNumber || "";

            return res.status(200).json({
            city: fullCity,
            street: finalStreet,
            houseNumber: finalHouseNumber
            });

        } catch (err) {
            console.error("❌ Error reverse-geocoding location:", err);
            return res.status(500).json({ message: "Failed to get location details", error: err.message });
        }
    }  
};




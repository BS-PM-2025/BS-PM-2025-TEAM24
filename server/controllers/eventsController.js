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
    }  
};




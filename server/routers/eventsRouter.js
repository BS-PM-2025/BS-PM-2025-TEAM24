const { Router } = require('express');
const { eventsController } = require('../controllers/eventsController');
const eventsRouter = new Router();

// Assuming you have these methods in your eventsController
eventsRouter.get('/getEvents', eventsController.getEvents);
eventsRouter.get('/getEventsByType/:callType', eventsController.getEventsByType);
eventsRouter.post('/addEvent', eventsController.addEvent); // Note: Adjusted route for adding an event
eventsRouter.delete('/deleteEvent/:id', eventsController.deleteEvent);
eventsRouter.put('/updateEvent/:callID', eventsController.updateEvent);
eventsRouter.post('/getLocationDetails', eventsController.getLocationDetails);
module.exports = { eventsRouter };

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
eventsRouter.delete('/applicants/:id',  verifyToken,  eventsController.unapply);
eventsRouter.get('/myApplications',               verifyToken,eventsController.getMyApplications);
eventsRouter.get('/getApprovedCalls',  verifyToken, eventsController.getMyApprovedCalls);
eventsRouter.post('/completeCall/:id', verifyToken, eventsController.completeCall);
eventsRouter.post('/approve/:id/:workerId',       verifyToken, eventsController.approveWorker);
module.exports = { eventsRouter };

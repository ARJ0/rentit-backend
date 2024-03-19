import { Router } from 'express';
import { createRequest, getUserRequests, manageRequestStatus, getUserOwnedRequests, getAllUserRequest } from '../Controllers/RequestController.js';

const router = Router();


router.post("/createRequest", createRequest.validator, createRequest.controller);
router.get("/getUserRequests", getUserRequests.validator, getUserRequests.controller);
router.get("/getUserOwnedRequests", getUserOwnedRequests.validator, getUserOwnedRequests.controller);
router.get("/getAllUserRequest", getAllUserRequest.validator, getAllUserRequest.controller);
router.post("/manageRequestStatus", manageRequestStatus.validator, manageRequestStatus.controller);




export default router;
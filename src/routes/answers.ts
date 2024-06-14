import { NextFunction, Request, Response, Router } from "express";
import { io } from "../app";
import Answer from "../models/Answer";
import { invalidAnswers } from "../constants";

const router = Router();

// middleware to validate answers
const validateAnswer = (req: Request, res: Response, next: NextFunction): Response | void => {
  const { answerBody }: { answerBody: string } = req.body;

  if (invalidAnswers.includes(answerBody.toLowerCase()) || !answerBody) {
    return res.status(400).json({ success: false, message: "Invalid answer"});
  }

  next();
};

router.post("/", validateAnswer, async (req: Request, res: Response) => {
  try {
    const { answerBody }: { answerBody: string } = req.body;

    const answer = await Answer.create({ answer: answerBody });
    await answer.save();

    // after saving the msg successfully we emit a new message to clients to be able to update the UI
    io.emit("new_answer", answer);
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
});

router.get("/", async (_req, res) => {
  try {
    const answers = await Answer.find().sort({ createdAt: -1 }).limit(100);
    res.json(answers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error"});
  }
});

export default router;

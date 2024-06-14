import { Schema, model, Document } from 'mongoose';
import { invalidAnswers } from '../constants';

interface IAnswer extends Document {
    answer: string;
    createdAt: Date;
}

const answerSchema = new Schema<IAnswer>({ 
    answer: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (value: string) {
                return !invalidAnswers.includes(value.toLowerCase());
            },
            message: 'Invalid answer.'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Answer = model<IAnswer>('answers', answerSchema); 

export default Answer;
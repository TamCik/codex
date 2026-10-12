import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { createAiGateway } from "@edgeone/makers-models-provider";
import { generateText } from "ai";
﻿

dotenv.config();

const aiGateway = createAiGateway({
  apiKey: process.env.MAKERS_MODELS_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from CodeX',
    });
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        if (!prompt) {
            return res.status(400).send({ message: 'Prompt tidak boleh kosong.' });
        }

        const response = await generateText({
            model: aiGateway("@makers/deepseek-v4-flash"),
            prompt: prompt,
        });

        // Ensure the response data is correctly accessed and serialized
        res.status(200).send({
            bot: response.text,
        });

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send({
            message: 'An error occurred while processing your request.',
            error: error.message
        });
    }
});

app.listen(5001, () => console.log('Server is running on port http://localhost:5001'));
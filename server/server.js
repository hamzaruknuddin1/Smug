import express, { json } from 'express'
import axios from 'axios'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

const apiEndpoint = "https://api.openai.com/v1/chat/completions";
const token = process.env.OPENAI_API_KEY;

const messages = [{"role": "system", "content": `you are a smart US company formation human assistant who knows everything about company formation, Taxation in US, Registered agent services and trade mark registeration. Never say you are a bot. You are a human and Your name is Matt but never tell you are human either. you are just a Tax Assistant. Here is the Tax Information in round brackets you need to know (
    
    Question: What kind of car do I need for a TCP License?
    Answer: The CPUC does not have any Year, Make or Model requirements for a vehicle being added to the TCP license. However, if you plan to provide transportation services, the vehicle must be operational and registered for commercial use. It is also recommended you verify with your insurance broker and any potential vendors, like Uber or Lyft, any specified vehicle requirements.
    
    Question: How long does the TCP process take?
    Answer: If the carrier has all required documentation, a TCP can become active in as little as two-to-four weeks after submission. The process in its entirety takes an average of five-to-six weeks, with CPUC allocating a maximum timeframe of ninety days.
    
    What type of insurance do I need for a TCP License?
    A Public Liability and Property Damage insurance policy is the main insurance policy you are required to have coverage for on your vehicles. The minimum coverage starts at $750,000 for a seven-seater vehicle, and increases with larger seating capacity.
    
    ) `}];

dotenv.config()

const configuration = new Configuration({
    apiKey:process.env.OPENAI_API_KEY,
});

console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Smug!'
    })
})

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        messages.push({"role": "user", "content": `${prompt}`});

        const config = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          };

        const requestData = {
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 1,
            max_tokens: 10000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0
          };
        
        axios.post(apiEndpoint, requestData, config)
            .then(response => {
                const reply = response.data['choices'][0]['message']['content'];
                const assistant_response = {"role": "assistant", "content": reply};
                messages.push(assistant_response);
                res.status(200).send({
                    bot: reply
                });
            })
            .catch(error => {
            console.log("error");
            console.error(error);
            });

    } catch (error) {
        console.error(error)
        res.status(500).send(error || 'Something went wrong');
    }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))

   
        // console.log(messages);
        // // console.log(openai.createChatCompletion);
        // // console.log(await openai.listEngines());
        // const response = await openai.createChatCompletion({
        //     model: "gpt-3.5-turbo",
        //     messages: messages,
        //     temperature: 1, // Higher values means the model will take more risks.
        //     max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
        //     top_p: 1, // alternative to sampling with temperature, called nucleus sampling
        //     frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
        //     presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
        // });
        // console.log(response);
import React from "react";
import { Component } from 'react'
import Button from 'react-bootstrap/Button'


const { Configuration, OpenAIApi } = require("openai");

class Content extends Component {

  constructor() {
    super()
    this.state = {
      value: '',
      heading: 'The Response From the AI will be shown here',
      response: '.... awaiting the response',
      prompt: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
    //to test the dynamic response change when running a prompt without using the API
    // heading: `AI Product description Suggestion: ${this.state.value}`,
    // response: `the Response from OpenAI API will be shown here`
  });
  }


  onFormSubmit = e => {
    e.preventDefault()
    console.log(this.state.value)
    //openAI code goes here
    const configuration = new Configuration({
      apiKey: (process.env.REACT_APP_OPENAI_API_KEY)
    });
    const openai = new OpenAIApi(configuration);

    openai.createCompletion("text-curie-001", {
      prompt: `Brainstorm some ideas for ${this.state.value}`,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    })
      .then((response) => {
        console.log(response)
        const answers = {
          heading: this.state.value,
          response: response.data.choices[0].text
        }
        console.log(answers);
        this.setState({
          heading: `AI Brainstorm some ideas for: ${this.state.value}`,
          response: `${response.data.choices[0].text}`,
          prompt: [...this.state.prompt, answers]
        })
       
        console.log(this.state.prompt)
      })
  }



  render() {
    return (
      <div className='prompt-container'>
        <form onSubmit={this.onFormSubmit} className="prompt">
            <h1 className='header'>Need help thinking of ideas?</h1>
            <h5>Here you can enter any topic you want to generate ideas. Like 'safe summer activities for children' or "Romantic first dates" </h5>
            <input
              type="text"
              value={this.state.value} onChange={this.handleChange}
              placeholder="Idea" />
            <p>
              enter as much information in as you want for an accurate answer, then click the submit button to generate ideas.
            </p>
            
          <Button variant="secondary" size="lg" type="submit" >
            Submit
          </Button>
          
        </form>

        
        <section>
            <div className='main-container'>
            
                <div className='main-response'>
                    <h2>{this.state.heading}</h2>
                    <h4>
                    {this.state.response}   
                    </h4>
                </div>

            </div>
     
        <div className='all-cards'>
            <div><h3>Previous responses will go here</h3></div>
            <div className='card-section'>
            {this.state.prompt.map((info)=>(
                <div className='card-container'>
                    <div className='info-container'>
                            <h4 className='title'>{info.heading}</h4>
                            <p className='response'>
                            {info.response}
                            </p>
                            <br />
                    </div>
                </div>
            ))}
            </div>
        </div>
        </section>

        <br />
        {/* <div className='all-cards'>
        {this.state.prompt.map((info)=>(
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{info.heading}</Card.Title>
            <Card.Text>
              {info.response}
            </Card.Text>

          </Card.Body>
        </Card>))} */}
        
        {/* </div> */}
      </div>
    );
  }
}

export default Content;
import React, {useState} from 'react'

export default function SendTags () {
    const [recipients, updateRecipients] = useState("")
    const [tags, updateTags] = useState("")
    const [config, updateConfig] = useState("")
    const [sendTo, updateSendTo] = useState("")
    const [sendType, updateSendType] = useState("")
    const [sent, updateSent] = useState(false)

    const handleChange = (event) => {
        const value = event.target.value
        switch(event.target.name) {
            case "tags":
                updateTags(value)
                return
            case "config":
                updateConfig(value)
                return
            case "sendTo":
                updateSendTo(value)
                return
            case "sendType":
                updateSendType(value)
                return
            default:
                return;
        }
    }

    // Format tags and send to input to remove left whitespace if spaces are added
    const formatTags = () => {
        const formattedTags = tags.toString().split(',')
        formattedTags.forEach(str => {
            if (str.includes(" ")) {
                str.toString().trimLeft()
            }
        })

        const formattedSendTags = sendTo.toString().split(',')
        formattedSendTags.forEach(str => {
            if (str.toString().includes(" ")) {
                str.toString().trimLeft()
            }
        })
    }

    // Parse recipient input into a JSON object
    const formatRecipients = () => {
        const recipientObj = JSON.parse(config)
    }

    // Filter through recipient keys to find matching tags
    const filterRecipients = () => {
        if (sendType.toLowerCase() === 'and') {
            formatTags()
            formatRecipients()
        }

        if (sendType.toLowerCase() === 'or') {
            formatTags()
            formatRecipients()
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        updateSent(true)
        filterRecipients()
    }

    return (
        <div>
            <form onSubmit={handleSubmit} style={{textAlign: "left"}}>
                <label style={{paddingRight: "10px"}}>
                    <div>
                        <span style={{paddingRight: "10px"}}>Tags (separated by commas):</span>
                        <input type="text" name="tags" onChange={handleChange}/>
                    </div>
                    <div>
                        <span style={{paddingRight: "10px", paddingTop: "20px"}} 
                              dangerouslySetInnerHTML={{__html: 'People Configs (e.g. {“Spiderman”: [“hero”, “tough”, “smart”, “tall”]}): '}}>
                        </span>
                        <input type="text" name="config" style={{width: '500px'}} onChange={handleChange}/>
                    </div>
                    <div>
                        <span style={{paddingRight: "10px", paddingTop: "20px"}}>Send To:</span>
                        <input type="text" name="sendTo" onChange={handleChange}/>
                    </div>
                    <div>
                        <span style={{paddingRight: "10px", paddingTop: "20px"}}>AND/OR?: </span>
                        <input type="text" name="sendType" onChange={handleChange}/>
                    </div>
                </label>
                <input type="submit" value="Send Messages" />
            </form>
            { sent && <div>Sent to: {recipients}</div> }
        </div>
    )
}
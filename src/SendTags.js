import React, {useState} from 'react'

export default function SendTags () {
    const [recipients, updateRecipients] = useState([])
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
                updateRecipients([])
                return
            case "config":
                updateConfig(value)
                updateRecipients([])
                return
            case "sendTo":
                updateSendTo(value)
                updateRecipients([])
                return
            case "sendType":
                updateSendType(value)
                updateRecipients([])
                return
            default:
                return;
        }
    }

    const filterRecipients = () => {
        // All tags must match
        // if (sendType.toLowerCase() === 'and') {
        //     const sendToTags = formatTags()
        //     const peopleObj = JSON.parse(config)
        // }

        if (sendType.toLowerCase() === 'or') {
            const formattedSendTags = sendTo.toString().split(',')
            formattedSendTags.forEach(str => {
                if (str.toString().includes(" ")) {
                    str.toString().trimLeft()
                }
            })

            const peopleObj = JSON.parse(config)

            for (var key in peopleObj) {
                for (var tag in formattedSendTags) {
                    if (peopleObj[key].length > 1) {
                        peopleObj[key].forEach(attr => {
                            if (attr === formattedSendTags[tag]) {
                                recipients.push(key)
                            }
                        })
                    } else {
                        if (peopleObj[key] === formattedSendTags[tag]) {
                            recipients.push(key)
                        }
                    }
                }
            }
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        filterRecipients()
        updateSent(true)
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
            { sent && <div>Sent to: {recipients.join()}</div> }
        </div>
    )
}

// {"Amanda":["oldest","sister"], "Brian":["middle","brother"], "Kristin":["youngest","sister"]}
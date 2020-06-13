import React, {useState} from 'react'

// TODO: Fix bug where recipients array doesn't clear after sending
// TODO: Fix bug where adding a space in between commas for tags doesn't get trimmed out
// TODO: Fix bug where recipients array returns duplicates for 'OR' command

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

    const filterRecipients = () => {
        updateRecipients([])

        if (sendType.toLowerCase() === 'and') {
            const formattedSendTags = sendTo.toString().split(',')
            formattedSendTags.forEach(str => {
                if (str.toString().includes(" ")) {
                    str.toString().trimLeft()
                }
            })

            const peopleObj = JSON.parse(config)

            for (var key in peopleObj) {
                peopleObj[key].sort()
                if (peopleObj[key].length === formattedSendTags.length) {
                    let validRecipient = true

                    peopleObj[key].sort()
                    formattedSendTags.sort()

                    while (validRecipient) {
                        for (let i = 0; i < formattedSendTags.length; i++) {
                            if (peopleObj[key][i] !== formattedSendTags[i]) {
                                validRecipient = false
                            }
                        }
                    }

                    if (validRecipient) {
                        recipients.push(key)
                    }
                }
            }

            return recipients
        }

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

            return recipients
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
import React, {useState} from 'react'
import './SendTags.css';

// TODO: Fix bug where adding a space in between commas for tags doesn't get trimmed out

export default function SendTags () {
    const [recipients, updateRecipients] = useState([])
    const [tags, updateTags] = useState("")
    const [config, updateConfig] = useState("")
    const [sendTo, updateSendTo] = useState("")
    const [sendType, updateSendType] = useState("")
    const [sent, updateSent] = useState(false)

    const handleChange = (event) => {
        updateRecipients([])
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
                    peopleObj[key].sort()
                    formattedSendTags.sort()

                    if (JSON.stringify(peopleObj[key]) === JSON.stringify(formattedSendTags)) {
                        recipients.push(key)
                        updateRecipients([...recipients, key])
                    }
                }
            }
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
                                updateRecipients([...recipients, key])
                            }
                        })
                    } else {
                        if (peopleObj[key] === formattedSendTags[tag]) {
                            recipients.push(key)
                            updateRecipients([...recipients, key])
                        }
                    }
                }
            }
        }
    }

    const formatMessage = (recipients) => {
        const uniqueKeys = new Set(recipients)
        const uniqueKeysArr = [...uniqueKeys]
        return uniqueKeysArr.join(', ')
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        filterRecipients()
        updateSent(true)
    }

    return (
        <div id='container'>
            <form onSubmit={handleSubmit} style={{textAlign: "left"}}>
                <label id="columnContainer">
                    <div className='twoColumns'>
                        <div className='inputBox'>
                            <span className='label'>TAGS</span>
                            <input type="text" name="tags" placeholder='Comma-separated (i.e. first,second,third)' className='inputField' onChange={handleChange}/>
                        </div>
                        <div className='inputBox'>
                            <span className='label'>SEND TO</span>
                            <input type="text" name="sendTo" placeholder='Tags to receive note (i.e. first,second)' className='inputField' onChange={handleChange}/>
                        </div>
                    </div>
                    <div className='twoColumns'>
                        <div className='inputBox'>
                            <span className='label' 
                                dangerouslySetInnerHTML={{__html: 'PEOPLE CONFIGS'}}>
                            </span>
                            <input type="text" name="config" placeholder='{“Spiderman”: [“hero”,“tough”,“smart”,“tall”]}' className='inputField' onChange={handleChange}/>
                        </div>
                        <div className='inputBox'>
                            <span className='label'>AND/OR</span>
                            <input type="text" name="sendType" placeholder='AND to match all tags / OR to match one tag' className='inputField' onChange={handleChange}/>
                        </div>
                    </div>
                </label>
                <div id="sendBtnDiv">
                    <input type="submit" value="Send Messages" id="sendBtn" />
                </div>
            </form>
            { recipients.length > 0 ? <div>Sent to: {formatMessage(recipients)}</div> : null }
        </div>
    )
}

// {"Amanda":["oldest","sister"], "Brian":["middle","brother"], "Kristin":["youngest","sister"]}
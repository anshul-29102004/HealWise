import sendEmail from '../utils/sendEmail.js'
import sendSMS from '../utils/sendSms.js'

const submitContact=async (req,res) => {
    try {
    const {name='',email='',phone='',message=''}=req.body
    if(!message.trim())
        {
            return res.json(400).json({success:false,error:'Message required'})
      }
      const adminEmail=process.env.CONTACT_EMAIL
      const adminPhone=process.env.CONTACT_PHONE

      const subject=`New Contact Query${name ? 'from' + name:''}`
      const bodyLines=[
        `Name:${name}`,
        `Email:${email}`,
        `Phone::${phone}`,
        `Message:${message.trim()}`
     ]
      const body=bodyLines.join('\n')
      if(adminEmail)
      {
        await sendEmail(adminEmail,subject,body)
      }
      if(adminPhone)
      {
        const smsText=`Query:${message.slice(0,120)}${message.length>120?'...' :''} |From:${name || 'Unknown'}`
        await sendSMS(adminPhone,smsText)
      }
      return res.json({success:true,message:'Submitted'})


    } catch (error) {
        console.log(error)
        return res.json(500).json({success:false,message:'Server error'})
        
    }
    
}

export {submitContact}
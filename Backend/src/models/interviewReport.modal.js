const mongoose =require('mongoose');


/**
 * job description
 * resume text
 * self description
 * technical question:[{
 *    question:"",
 *    answer:"",
 *    feedback:"",
 *    rating:"",
 *    intention:"",
 *    keyStrengths:[""],
 *    keyWeaknesses:[""],
 *    confidenceScore:""
 *    
 * }]
 * behavioural question:[{
 *    question:"",
 *    answer:"",
 *    feedback:"",
 *    rating:"",
 *    intention:"",
 *    keyStrengths:[""],
 *    keyWeaknesses:[""],
 *    confidenceScore:""
 *    
 * }]
 * preparation plan:[{
 *   topic:"",
 *   description:"",
 *   status:"",
 *   deadline:"",
 *   resources:[""],
 *   confidence:"",
 *   feedback:"",
 *   explanation:"",
 *   task:""
 * }]
 * skill gap:[{
 *      skill:"",
 *      severity:"",
 *      explanation:""
 * }],
 * weakness:[""]
 * strength:[""]
 * score:""
 * overall
 * Interview Report Modal Structure
 * 
 */

  //schema for behavioral question  
const behaviouralQuestionSchema=new mongoose.Schema({
        question:{
            type:String,
            required:true
        },
        answer:{
            type:String,
            required:true
        },
        feedback:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true,
            min:0,
            max:100
        },
        intention:{
            type:String,
            required:true
        },
        keyStrengths:{
            type:Array,
            required:true
        },
        keyWeaknesses:{
            type:Array,
            required:true
        },
        confidenceScore:{
            type:Number,
            required:true,
            min:0,
            max:100
        }
    }) 

//schema for preparation plan
const preparationPlanSchema=new mongoose.Schema({
    topic:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    deadline:{
        type:String,
        required:true
    },
    resources:{
        type:Array,
        required:true
    },
    confidence:{
        type:String,
        required:true
    },
    feedback:{
        type:String,
        required:true
    },
    explanation:{
        type:String,
        required:true
    },
    task:{
        type:String,
        required:true
    }
    })

// schema for skill gap    
const skillGapSchema=new mongoose.Schema({
    skill:{
        type:String,
        required:true
    },
    severity:{
        type:String,
        required:true
    },
    explanation:{
        type:String,
        required:true
    }
})

// schema for weakness
const weaknessSchema=new mongoose.Schema({
    weakness:{
        type:String,
        required:true
    }
})

// schema for strength
const strengthSchema=new mongoose.Schema({
    strength:{
        type:String,
        required:true
    }
})

// schema for overall
const overallSchema=new mongoose.Schema({
    overall:{
        type:String,
        required:true
    }
})

//schema for technical question
const technicalQuestionSchema=new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    feedback:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:0,
        max:100
    },
    intention:{
        type:String,
        required:true
    },
    keyStrengths:{
        type:Array,
        required:true
    },
    keyWeaknesses:{
        type:Array,
        required:true
    },
    confidenceScore:{
        type:Number,
        required:true,
        min:0,
        max:100
    }
})

//schema for interview report
const interviewReportSchema=new mongoose.Schema({
    jobDescription:{
        type:String,
        required:true
    },
    resumeText:{
        type:String,
        required:true
    },
    selfDescription:{
        type:String,
        required:true
    },
    score:{
        type:Number,
        required:true,
        min:0,
        max:100
    },
    technicalQuestion:{
        type:Array,
        required:true
    },
    behaviouralQuestion:{
        type:Array,
        required:true
    },
    preparationPlan:{
        type:Array,
        required:true
    },
    skillGap:{
        type:Array,
        required:true
    },
    weakness:{
        type:Array,
        required:true
    },
    strength:{
        type:Array,
        required:true
    },
    overall:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
})

const interviewReportModel=mongoose.model("interview",interviewReportSchema)

module.exports=interviewReportModel;
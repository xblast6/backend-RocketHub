import mongoose from "mongoose";

const RocketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxLength: 30
    },
    image: {
      type: String,
      required: true,

    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true 
    },
    height: {
      value: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        required: true,
        default: "m"
      }
    },
    diameter: {
      value: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        required: true,
        default: "m"
      }
    },
    mass: {
      value: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        required: true,
        default: "t"
      }
    },
    stages: {
      stageNumber: {
        type: Number,
        required: true,
        default: 1
      },
      firstStageEngine: {
        engineName: {
          type:String,
          required:true
        },
        engineCount: {
          type: Number,
          required: true,
          min: 1,
          max: 40
        }
      },
      secondStageEngine: {
        engineName: {
          type:String
        },
        engineCount: {
          type: Number,
          max: 10
        }
      },
      thirdStageEngine: {
        engineName: {
          type:String
        },
        engineCount: {
          type: Number,
          max: 4
        },
        opzionale: {
          type: Boolean,
          default: false
        }
      }
    }
  },
  {
    timestamps: true
  }
);

const Rocket = mongoose.model("Rocket", RocketSchema);

export default Rocket;

import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxLength: 30
    },
    logo: {
      type: String,
      required: true,
      
    },
    headquarters: {
      type: String
    },
    website: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true 
  }
);

const Company = mongoose.model("Company", CompanySchema);

export default Company;

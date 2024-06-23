import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema(
    {
        filename: {
            type: String,
            require: true
        },
        uploader : {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { 
        timestamps: true
    }
)

export const File = mongoose.model("File", fileSchema);
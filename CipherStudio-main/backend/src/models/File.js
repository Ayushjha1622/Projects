import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'File must belong to a project'],
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a file/folder name'],
      trim: true,
      maxlength: [255, 'Name cannot be more than 255 characters'],
    },
    type: {
      type: String,
      required: true,
      enum: ['file', 'folder'],
      default: 'file',
    },
    content: {
      type: String,
      default: '',
    },
    s3Key: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
fileSchema.index({ projectId: 1, parentId: 1 });
fileSchema.index({ projectId: 1, type: 1 });

// Virtual for getting children (nested files/folders)
fileSchema.virtual('children', {
  ref: 'File',
  localField: '_id',
  foreignField: 'parentId',
});

// Enable virtuals in JSON
fileSchema.set('toJSON', { virtuals: true });
fileSchema.set('toObject', { virtuals: true });

// Pre-remove middleware to delete all children when a folder is deleted
fileSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  if (this.type === 'folder') {
    // Find all children recursively
    const children = await this.model('File').find({ parentId: this._id });
    
    // Delete each child (this will trigger their pre-remove hooks)
    for (const child of children) {
      await child.deleteOne();
    }
  }
  next();
});

// Method to get full path
fileSchema.methods.getFullPath = async function () {
  let path = this.name;
  let current = this;

  while (current.parentId) {
    current = await this.model('File').findById(current.parentId);
    if (current) {
      path = `${current.name}/${path}`;
    } else {
      break;
    }
  }

  return path;
};

const File = mongoose.model('File', fileSchema);

export default File;
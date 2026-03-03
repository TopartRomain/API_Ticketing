const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
      select: false,
    },
    role: {
      type: String,
      enum: ['collaborateur', 'support', 'manager'],
      default: 'collaborateur',
    },
    team: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

// ── Hash password before save ───────────────────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  this.password = await bcrypt.hash(this.password, 12);
});

// ── Compare password helper ─────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

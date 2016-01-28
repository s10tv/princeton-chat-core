export default new SimpleSchema({
  userId: { type: String },
  unreadCount: { type: Number, defaultValue: 0 },
  isTyping: { type: Boolean, defaultValue: false, optional: true },
})

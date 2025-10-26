const requestLogger = (req, res, next) => {
  const logData = { ...req.body };
  
  // Сокращаем логирование больших данных
  if (logData.coverImage) {
    logData.coverImage = `[IMAGE: ${logData.coverImage.length} chars]`;
  }
  if (logData.blocks) {
    logData.blocks = logData.blocks.map(block => ({
      ...block,
      content: block.content && block.content.image ? 
        { ...block.content, image: `[IMAGE: ${block.content.image.length} chars]` } : 
        block.content
    }));
  }
  
  console.log(`📨 ${req.method} ${req.url}`, logData);
  next();
};

export default requestLogger;
const dayjs = require('dayjs')
const fs = require('fs')
const { generateTemplateFiles } = require("generate-template-files")


generateTemplateFiles([
  {
    defaultCase: '(titleCase)',
    option: 'Create a post template',
    entry: {
      folderPath: './tools/templates/post.md'
    },
    stringReplacers: [
      {question: 'post title', slot: '__title__'},
    ],
    dynamicReplacers: [
      {slot: '__date__', slotValue: dayjs().format('YYYY-MM-DD').toString() }
    ],
    output: {
      path: './src/posts/__title__.md',
      pathAndFileNameDefaultCase: '(kebabCase)',
      overwrite: true,
    },
    onComplete: (res) => {
      fs.mkdirSync(res.output.path.replace('posts','images').replace('.md',''))
    },
  }
])
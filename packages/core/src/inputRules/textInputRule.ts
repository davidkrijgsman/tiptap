import { InputRule, InputRuleFinder } from '../InputRule'

export default function textInputRule(config: {
  find: InputRuleFinder,
  replace: string,
}) {
  return new InputRule({
    find: config.find,
    handler: ({ state, range, match }) => {
      let insert = config.replace
      let start = range.from
      const end = range.to

      if (match[1]) {
        const offset = match[0].lastIndexOf(match[1])

        insert += match[0].slice(offset + match[1].length)
        start += offset

        const cutOff = start - end

        if (cutOff > 0) {
          insert = match[0].slice(offset - cutOff, offset) + insert
          start = end
        }
      }

      state.tr.insertText(insert, start, end)
    },
  })
}

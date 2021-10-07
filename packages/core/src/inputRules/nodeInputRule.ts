import { NodeType } from 'prosemirror-model'
import { InputRule, InputRuleMatcher, ExtendedRegExpMatchArray } from '../InputRule'
import callOrReturn from '../utilities/callOrReturn'

export default function nodeInputRule(config: {
  matcher: InputRuleMatcher,
  type: NodeType,
  getAttributes?:
    | Record<string, any>
    | ((match: ExtendedRegExpMatchArray) => Record<string, any>)
    | false
    | null
  ,
}) {
  return new InputRule({
    matcher: config.matcher,
    handler: ({ state, range, match }) => {
      const attributes = callOrReturn(config.getAttributes, undefined, match) || {}
      const { tr } = state
      const start = range.from
      let end = range.to

      if (match[1]) {
        const offset = match[0].lastIndexOf(match[1])
        let matchStart = start + offset

        if (matchStart > end) {
          matchStart = end
        } else {
          end = matchStart + match[1].length
        }

        // insert last typed character
        const lastChar = match[0][match[0].length - 1]
        tr.insertText(lastChar, start + match[0].length - 1)

        // insert node from input rule
        tr.replaceWith(matchStart, end, config.type.create(attributes))
      } else if (match[0]) {
        tr.replaceWith(start, end, config.type.create(attributes))
      }
    },
  })
}

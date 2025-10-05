/* eslint-disable */

const crypto = require('crypto')
const { Kind, print, visit } = require('graphql')

module.exports = {
    plugin(schema, documents) {
        const queriesMap = {
            queries: {},
            version: '',
        }

        const fragmentMap = new Map()

        documents.forEach((doc) => {
            if (!doc.document) return

            doc.document.definitions.forEach((def) => {
                if (def.kind === Kind.FRAGMENT_DEFINITION) {
                    fragmentMap.set(def.name.value, def)
                }
            })
        })

        function collectFragmentsInUsageOrder(node, seen = new Set(), ordered = []) {
            visit(node, {
                FragmentSpread(spread) {
                    const name = spread.name.value
                    if (!seen.has(name)) {
                        seen.add(name)
                        const fragment = fragmentMap.get(name)
                        if (fragment) {
                            ordered.push(fragment) // ✅ добавляем фрагмент ДО рекурсии
                            collectFragmentsInUsageOrder(fragment, seen, ordered)
                        }
                    }
                },
            })
            return ordered
        }

        documents.forEach((doc) => {
            if (!doc.document) return

            doc.document.definitions
                .filter((def) => def.kind === Kind.OPERATION_DEFINITION)
                .forEach((operation) => {
                    const printedOperation = print(operation).trim()

                    const fragments = collectFragmentsInUsageOrder(operation)
                    const printedFragments = fragments.map((f) => print(f).trim())

                    const fullQuery = [printedOperation, ...printedFragments].join('\n\n')

                    const hash = crypto.createHash('sha256').update(fullQuery).digest('hex')
                    queriesMap.queries[hash] = fullQuery
                })
        })

        queriesMap.version = crypto.createHash('sha256').update(JSON.stringify(queriesMap.queries)).digest('hex')

        return JSON.stringify(queriesMap, null, 2)
    },
}

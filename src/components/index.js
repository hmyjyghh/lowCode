const req = require.context('./', false, /[^.]+\.vue/)
const reqParser = require.context('./', false, /parser-[^.]+\.js/)

const componentsName = req.keys()
const components = componentsName.reduce((components, module) => {
  // console.log('components', components);
  // console.log('module', module);
  const mod = req(module)
  // console.log('mod', mod);

  components[mod.default.name] = mod.default

  // console.log('components', components);
  return components
}, {})

const parsersName = reqParser.keys()
const parsers = parsersName.reduce((parsers, module) => {
  const mod = reqParser(module)

  parsers[mod.default.name] = mod.default
  return parsers
}, {})

export { components, parsers }

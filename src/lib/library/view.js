module.exports = async function(context) {
  const LIBRARY_INDEX_GIST = process.env['LIBRARY_INDEX_GIST'] || '4fe0dfd70e7556f62cccd24c96a06be2'
  const Gists = require('gists')
  const gists = new Gists({
    token: process.env['IGNITE_GITHUB_TOKEN']
  })
  const getLibraryComponent = require('./getComponent')
  const { parameters, filesystem, print, prompt } = context
  const searchTerm = parameters.third

  let res
  try {
    res = await gists.get(LIBRARY_INDEX_GIST)
  } catch (e) {
    // if not found, exit gracefully 
    print.info(`Can't find the Ignite library index`)
    print.info('')
    print.info(`You may have set your env variable incorrectly (Not really, this is COMING SOON) or don't have a Personal Access Token set (more likely!)`)
    print.info(`Go to https://github.com/settings/tokens to generate one and then run this in terminal:`)
    print.info(`export IGNITE_GITHUB_TOKEN='tokenhere'`)
    process.exit(e.code)
  }

  // parse out the components
  const components = JSON.parse(res.body.files['library-index.json'].content).components

  // search for a component
  const searchResults = components.filter(comp => comp.name.includes(searchTerm))

  if (!searchResults.length) {
    print.error('No matching components found!')
    process.exit(1)
  }

  var component
  for (var i=0; i<searchResults.length; i++) {
    component = searchResults[i]
    print.info(`${component.name} - ${component.description}`)
  }
}

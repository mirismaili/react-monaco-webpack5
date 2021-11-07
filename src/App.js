// import MonacoEditor from '@monaco-editor/react'
import 'monaco-editor'
import {editor, Uri} from 'monaco-editor/esm/vs/editor/editor.api'
import {setDiagnosticsOptions} from 'monaco-yaml'
// import { setDiagnosticsOptions } from 'monaco-yaml/lib/esm/monaco.contribution'
import 'monaco-yaml/lib/esm/yaml.worker'
import React, {useLayoutEffect, useState} from 'react'
// import useScript from './useScript'

window.MonacoEnvironment = {
	getWorkerUrl (moduleId, label) {
		console.log({label})
		if (label === 'yaml') {
			return '/static/js/yaml.worker.chunk.js'
		}
		return '/static/js/editor.worker.chunk.js'
	},
}

setDiagnosticsOptions({
	validate: true,
	enableSchemaRequest: true,
	format: true,
	hover: true,
	completion: true,
	schemas: [{
		uri: 'http://myserver/foo-schema.json',
		fileMatch: ['*'],
		schema: {
			type: 'object',
			properties: {
				property: {
					description: 'I have a description',
				},
				titledProperty: {
					title: 'I have a title',
					description: 'I also have a description',
				},
				markdown: {
					markdownDescription: 'Even **markdown** _descriptions_ `are` ~~not~~ supported!',
				},
				enum: {
					description: 'Pick your starter',
					enum: ['Bulbasaur', 'Squirtle', 'Charmander', 'Pikachu'],
				},
				number: {
					description: 'Numbers work!',
					minimum: 42,
					maximum: 1337,
				},
				boolean: {
					description: 'Are boolean supported?',
					type: 'boolean',
				},
				string: {
					type: 'string',
				},
				reference: {
					description: 'JSON schemas can be referenced, even recursively',
					$ref: '#',
				},
				array: {
					description: 'It also works in arrays',
					items: {
						$ref: '#',
					},
				},
			},
		},
	}],
})

const monacoVersion = '0.29.1'
const vsPath = `https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/${monacoVersion}/min/vs`

export default function App () {
	const [yaml, setYaml] = useState('p1:')
	
	// const {loaded} = useScript({src: vsPath + '/loader.min.js'})
	const loaded = false
	
	useLayoutEffect(() => {
		const value = `
# Property descriptions are displayed when hovering over properties using your cursor
property: This property has a JSON schema description


# Titles work too!
titledProperty: Titles work too!


# Even markdown descriptions work
markdown: hover me to get a markdown based description 😮


# Enums can be autocompleted by placing the cursor after the colon and pressing Ctrl+Space
enum:


# Of course numbers are supported!
number: 12


# As well as booleans!
boolean: true


# And strings
string: I am a string


# This property is using the JSON schema recursively
reference:
  boolean: Not a boolean


# Also works in arrays
array:
  - string: 12
    enum: Mewtwo
    reference:
      reference:
        boolean: true


# JSON referenses can be clicked for navigation
pointer:
  $ref: '#/array'


formatting:       Formatting is supported too! Under the hood this is powered by Prettier. Just press Ctrl+Shift+I or right click and press Format to format this document.






`.replace(/:$/m, ': ')
		
		editor.create(document.getElementById('editor'), {
			automaticLayout: true,
			model: editor.createModel(value, 'yaml', Uri.parse('monaco-yaml.yaml')),
			theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs-light',
		})
	}, [])
	
	useLayoutEffect(() => {
		console.log({loaded}, document.getElementById('editor'), window.require)
		if (!loaded) return
		
		window.require.config({paths: {vs: vsPath}})
		window.require(['vs/editor/editor.main'], () => {
			window.monaco.languages.onLanguage('yaml', () => {
				console.log('onLanguage')
				window.monaco.editor.createWebWorker({
					moduleId: 'vs/language/yaml/yamlWorker', // '/static/js/yaml.worker.chunk.js', // or
																		  // 'static/js/mylang.worker.chunk'
				})
			})
			
			const {editor, Uri} = window.monaco
			
			const value = `
# Property descriptions are displayed when hovering over properties using your cursor
property: This property has a JSON schema description


# Titles work too!
titledProperty: Titles work too!


# Even markdown descriptions work
markdown: hover me to get a markdown based description 😮


# Enums can be autocompleted by placing the cursor after the colon and pressing Ctrl+Space
enum:


# Of course numbers are supported!
number: 12


# As well as booleans!
boolean: true


# And strings
string: I am a string


# This property is using the JSON schema recursively
reference:
  boolean: Not a boolean


# Also works in arrays
array:
  - string: 12
    enum: Mewtwo
    reference:
      reference:
        boolean: true


# JSON referenses can be clicked for navigation
pointer:
  $ref: '#/array'


formatting:       Formatting is supported too! Under the hood this is powered by Prettier. Just press Ctrl+Shift+I or right click and press Format to format this document.






`.replace(/:$/m, ': ')
			
			editor.create(document.getElementById('editor'), {
				// Monaco-yaml features should just work if the editor language is set to 'yaml'.
				automaticLayout: true,
				model: editor.createModel(value, 'yaml', Uri.parse('monaco-yaml.yaml')),
				theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs-light',
			})
			
			// window.monaco.editor.create(document.getElementById('editor'), {
			//   value: `function x() {\n  console.log("Hello world!");\n}`,
			//   language: 'javascript',
			//   theme: 'vs-dark',
			// });
		})
	}, [loaded])
	
	//  useEffect(() => {
	//    setDiagnosticsOptions({
	//     validate: true,
	//     enableSchemaRequest: true,
	//     format: true,
	//     hover: true,
	//     completion: true,
	//     schemas: [{
	//       uri: 'http://myserver/foo-schema.json',
	//       fileMatch: ['*'],
	//       schema: {
	//         // sample schema:
	//         type: 'object',
	//         properties: {
	//           property: {
	//             description: 'I have a description',
	//           },
	//           titledProperty: {
	//             title: 'I have a title',
	//             description: 'I also have a description',
	//           },
	//           markdown: {
	//             markdownDescription: 'Even **markdown** _descriptions_ `are` ~~not~~ supported!',
	//           },
	//           enum: {
	//             description: 'Pick your starter',
	//             enum: ['Bulbasaur', 'Squirtle', 'Charmander', 'Pikachu'],
	//           },
	//           number: {
	//             description: 'Numbers work!',
	//             minimum: 42,
	//             maximum: 1337,
	//           },
	//           boolean: {
	//             description: 'Are boolean supported?',
	//             type: 'boolean',
	//           },
	//           string: {
	//             type: 'string',
	//           },
	//           reference: {
	//             description: 'JSON schemas can be referenced, even recursively',
	//             $ref: '#',
	//           },
	//           array: {
	//             description: 'It also works in arrays',
	//             items: {
	//               $ref: '#',
	//             },
	//           },
	//         },
	//       },
	//     }],
	//   })
	// }, [])
	
	const options = {
		autoIndent: 'brackets',
		formatOnPaste: true,
		formatOnType: true,
	}
	return (
			<div id="editor" style={{height: '50vh', border: '1px solid black'}}/>
			// <MonacoEditor
			//   height='50vh'
			//   language='yaml'
			//   options={options}
			//   value={yaml}
			//   onChange={setYaml}
			// />
	)
}

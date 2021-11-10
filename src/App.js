import 'monaco-editor'
import {editor, Uri} from 'monaco-editor/esm/vs/editor/editor.api'
import {setDiagnosticsOptions} from 'monaco-yaml'
import 'monaco-yaml/lib/esm/yaml.worker'
import React, {useLayoutEffect} from 'react'

window.MonacoEnvironment = {
	getWorker(moduleId, label) {
		console.log({label})
		switch (label) {
		case 'editorWorkerService':
			return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url))
		case 'yaml':
			return new Worker(new URL('monaco-yaml/lib/esm/yaml.worker', import.meta.url))
		default:
			throw new Error(`Unknown label ${label}`)
		}
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

export default function App () {
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
	
	const options = {
		autoIndent: 'brackets',
		formatOnPaste: true,
		formatOnType: true,
	}
	return (
			<div id="editor" style={{height: '50vh', border: '1px solid black'}} />
	)
}

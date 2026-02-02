import { buildApp } from './index.ts'

const PORT = 3000
const HOST = '0.0.0.0'

const app = await buildApp()

app.listen({ port: PORT, host: HOST }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Server listening at ${address}`)
})

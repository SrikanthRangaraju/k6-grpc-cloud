import grpc from 'k6/net/grpc';
import { check, sleep } from 'k6';

// Load the proto file
const client = new grpc.Client();
client.load(['proto'], 'your_service.proto'); // Provide the correct proto file path

export default function () {
    // Connect to the gRPC server
    client.connect('localhost:50051', {
        plaintext: true, // Set to false if using TLS
    });

    // Define the authentication token
    const token = 'your_bearer_token_here'; // Replace with your actual token

    // Define request payload
    const request = {
        name: 'John Doe',  // Change according to your RPC request structure
    };

    // Define metadata with Bearer token
    const metadata = {
        Authorization: `Bearer ${token}`,
    };

    // Invoke the gRPC method with authentication metadata
    const response = client.invoke('your.package.Service/Method', request, metadata);

    // Validate the response
    check(response, {
        'is status OK': (r) => r && r.status === grpc.StatusOK,
        'has response': (r) => r && r.message && r.message.result !== undefined,
    });

    console.log(`Response: ${JSON.stringify(response.message)}`);

    // Close the client connection
    client.close();
    sleep(1);
}

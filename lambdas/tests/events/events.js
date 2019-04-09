var _ = require('lodash');
const uuidv4 = require('uuid/v4');

function Events(){}

Events.prototype.API_GATEWAY_HTTP_PROXY_GET = function(resource, getParamsObject, apiKey = '')
{
    var ret = {
        resource: '/{proxy+}',
        path: resource,
        httpMethod: 'GET',
        headers:
            {    Accept: 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.8',
                'cache-control': 'no-cache',
                'CloudFront-Forwarded-Proto': 'https',
                'CloudFront-Is-Desktop-Viewer': 'false',
                'CloudFront-Is-Mobile-Viewer': 'true',
                'CloudFront-Is-SmartTV-Viewer': 'false',
                'CloudFront-Is-Tablet-Viewer': 'false',
                'CloudFront-Viewer-Country': 'ZA',
                'content-type': 'text/plain',
                dnt: '1',
                Host: '1aqbqyfxoc.execute-api.eu-west-1.amazonaws.com',
                origin: 'http://localhost:8100',
                pragma: 'no-cache',
                Referer: 'http://localhost:8100/',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
                Via: '2.0 a88d0f17b53465837786e5dd493752fa.cloudfront.net (CloudFront)',
                'X-Amz-Cf-Id': 'y32w_2gdr6SKRVWCtdKWt59M6zTGZJoAH-N9_um08tBbxOIk7Bx_Cw==',
                'X-Amzn-Trace-Id': 'Root=1-5947c7e4-2d6ee52921a1d56116df7272',
                'X-Forwarded-For': '41.160.157.211, 54.182.244.70',
                'X-Forwarded-Port': '443',
                'X-Forwarded-Proto': 'https' },
        queryStringParameters: getParamsObject, //TODO: Make string, loop over object and join with &
        pathParameters: { proxy: resource },
        stageVariables: { function: 'lambda_function_XXX' },
        requestContext:
        { path: '/STAGE_XXX' + resource,
            accountId: '123456789012',
            resourceId: 'zmstjf',
            stage: 'dev',
            requestId: uuidv4(),
            identity:
                { cognitoIdentityPoolId: null,
                    accountId: null,
                    cognitoIdentityId: null,
                    caller: null,
                    apiKey: '',
                    sourceIp: '41.160.157.211',
                    accessKey: null,
                    cognitoAuthenticationType: null,
                    cognitoAuthenticationProvider: null,
                    userArn: null,
                    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
                    user: null },
            resourcePath: '/{proxy+}',
            httpMethod: 'GET',
            apiId: '1aqbqyfxoc'
        },
        body: null,
        isBase64Encoded: false };

    if(apiKey)
        ret.headers["x-api-key"] = apiKey;

    return ret;
}
Events.prototype.API_GATEWAY_HTTP_PROXY_POST = function(resource, requestBody, apiKey = '')
{
    var ret = {
        resource: '/{proxy+}',
        path: resource,
        httpMethod: 'POST',
        headers:
            {    Accept: 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.8',
                'cache-control': 'no-cache',
                'CloudFront-Forwarded-Proto': 'https',
                'CloudFront-Is-Desktop-Viewer': 'false',
                'CloudFront-Is-Mobile-Viewer': 'true',
                'CloudFront-Is-SmartTV-Viewer': 'false',
                'CloudFront-Is-Tablet-Viewer': 'false',
                'CloudFront-Viewer-Country': 'ZA',
                'content-type': 'text/plain',
                dnt: '1',
                Host: '1aqbqyfxoc.execute-api.eu-west-1.amazonaws.com',
                origin: 'http://localhost:8100',
                pragma: 'no-cache',
                Referer: 'http://localhost:8100/',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
                Via: '2.0 a88d0f17b53465837786e5dd493752fa.cloudfront.net (CloudFront)',
                'X-Amz-Cf-Id': 'y32w_2gdr6SKRVWCtdKWt59M6zTGZJoAH-N9_um08tBbxOIk7Bx_Cw==',
                'X-Amzn-Trace-Id': 'Root=1-5947c7e4-2d6ee52921a1d56116df7272',
                'X-Forwarded-For': '41.160.157.211, 54.182.244.70',
                'X-Forwarded-Port': '443',
                'X-Forwarded-Proto': 'https' },
        queryStringParameters: null,
        pathParameters: { proxy: resource },
        stageVariables: { function: 'lambda_function_XXX' },
        requestContext:
            { path: '/STAGE_XXX' + resource,
                accountId: '123456789012',
                resourceId: 'zmstjf',
                stage: 'dev',
                requestId: uuidv4(),
                identity:
                    { cognitoIdentityPoolId: null,
                        accountId: null,
                        cognitoIdentityId: null,
                        caller: null,
                        apiKey: '',
                        sourceIp: '41.160.157.211',
                        accessKey: null,
                        cognitoAuthenticationType: null,
                        cognitoAuthenticationProvider: null,
                        userArn: null,
                        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
                        user: null },
                resourcePath: '/{proxy+}',
                httpMethod: 'POST',
                apiId: '1aqbqyfxoc'
            },
        body: JSON.stringify(requestBody),
        isBase64Encoded: false };

    if(apiKey)
        ret.headers["x-api-key"] = apiKey;

    return ret;
}
Events.prototype.API_GATEWAY_HTTP_RESOURCE = function(requestBody)
{
    return requestBody;
}
Events.prototype.SQS_MESSAGES = function(messageBodies)
{
    var ii = 0;
    var messages = _.map(messageBodies, function (mess)
    {
        return {
            "messageId": "TEST-"+ (ii++),
            "receiptHandle": "MessageReceiptHandle",
            "body": JSON.stringify(mess),
            "attributes": {
                "ApproximateReceiveCount": "1",
                "SentTimestamp": "1523232000000",
                "SenderId": "123456789012",
                "ApproximateFirstReceiveTimestamp": "1523232000001"
            },
            "messageAttributes": {},
            "md5OfBody": "7b270e59b47ff90a553787216d55d91d",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:eu-west-1:123456789012:MyQueueXXX",
            "awsRegion": "eu-west-1"
        };
    });

    return {
            "Records": messages
        }
}
Events.prototype.SNS_MESSAGE = function(subject, messageBody)
{
    var ii = 0;

        return {
            "Records": [
                {
                "EventSource": "aws:sns",
                "EventVersion": "1.0",
                "EventSubscriptionArn": "arn:aws:sns:us-east-1:{{accountId}}:ExampleTopic",
                "Sns": {
                    "Type": "Notification",
                    "MessageId":uuidv4(),
                    "TopicArn": "arn:aws:sns:us-east-1:123456789012:ExampleTopic",
                    "Subject": subject,
                    "Message": JSON.stringify(messageBody),
                    "Timestamp": "1970-01-01T00:00:00.000Z",
                    "SignatureVersion": "1",
                    "Signature": "EXAMPLE",
                    "SigningCertUrl": "EXAMPLE",
                    "UnsubscribeUrl": "EXAMPLE",
                    "MessageAttributes": {},
                        "TestBinary": {
                            "Type": "Binary",
                            "Value": "TestBinary"
                        }
                    }
                }
            ]
        };
};

module.exports = Events;


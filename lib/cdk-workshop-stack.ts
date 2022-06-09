import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';

import { HitCounter } from './hitcounter';

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // define a new AWS lambda function
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X, // execution environment
      code: lambda.Code.fromAsset('lambda'), // code loaded from "lambda" directory
      handler: 'hello.handler', // file is "hello", function is "handler"
    });

    // define a new AWS lambda function
    const foobar = new lambda.Function(this, 'FoobarHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'foobar.handler',
    });

    // api gateway rest endpoints
    new apiGateway.LambdaRestApi(this, 'HelloEndpoint', {
      handler: hello,
    });

    new apiGateway.LambdaRestApi(this, 'FoobarEndpoint', {
      handler: foobar,
    });

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });

    // defines an API Gateway REST API resource backed by our "hello" function.
    new apiGateway.LambdaRestApi(this, 'HelloHitCounterEndpoint', {
      handler: helloWithCounter.handler
    });
  }
}

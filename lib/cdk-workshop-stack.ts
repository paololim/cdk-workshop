import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { HitCounter } from './hitcounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloLambdaFn = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X, // execution environment
      code: lambda.Code.fromAsset('lambda'), // code loaded from "lambda" directory
      handler: 'hello.handler', // file is "hello", function is "handler"
    });

    const hitCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: helloLambdaFn
    });

    // defines an API Gateway REST API resource backed by our "hello" function.
    new apiGateway.LambdaRestApi(this, 'HelloHitCounterEndpoint', {
      handler: hitCounter.handler
    });

    new TableViewer(this, 'ViewHelloHitCounter', {
      title: 'Hello hit count viewer',
      table: hitCounter.table,
      sortBy: '-hits',
    });
  }
}

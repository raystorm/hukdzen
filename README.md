Hukdzen (Cloud)
===============

This is in Typescript/React based AWS Amplify Web Application,
designed to tag, and store Smalgyax Language Learning Documents.

Tech Stack
----------

  * Typescript
  * React
  * Amplify
  * S3
  * DynamoDB
  * OpenSearch
  * Lambda (w/ Javascript)

### Supports

OpenID Auth w/:
  * Google
  * Facebook
  * Amazon

### Field and languages supported

  * Title
    * English
    * Smalgyax, BC Orthography
    * Smalgyax, AK Orthography
  * Description
    * English
    * Smalgyax, BC Orthography
    * Smalgyax, AK Orthography

Setup Instructions
------------------

Checkout the code and pull the desired amplify enviornment.  
Follow Normal Amplify Environment Setup, and publish changes.

### Non-Amplify Changes

After `amplify publish`

  1. Setup Initial Owner user, and Box 
     1. In [AWS Cognito](https://aws.amazon.com/cognito/) browse to
        `User Pools -> <user-pool-name> -> Groups` then  
        click on `[Create group]` and name the group `WebAppAdmin`
     2. In a new browser tab, Open the Web Application and navigate to the login page.
        Create a new user, ignore the error message
     3. Back in the cognito, add the new user to the `WebAppAdmin` group.
     4. Set the user GUID in the `src/Box/boxTypes.ts` file
     5. Publish the change
     6. Open the Web Application and create the public group.
     7. In [DynamoDB](https://aws.amazon.com/dynamodb/) browse to
        `Tables -> Xbiis-<ID string>-<env>` then 
        click on `[Explore table items]`
        1. Set the `id` to value to match the `intialXbiis.id` value  
           from the `src/Box/boxTypes.ts` file
        2. Tick the confirm box
        3. Click `Save and close`
  2. Setup OpenSearch Access
     1. In [OpenSearch](https://aws.amazon.com/opensearch-service/)
        browse to `Domains -> <amplify-domain>`
        1. Copy the `Domain Endpoint` Url
        2. Paste the Url into the `node` value into the `osClient` constructor
           in the `amplify/backend/function/ingestTrigger/src/index.js` file
     2. `amplify publish` the change. 
     3. In a new tab open [CloudWatch](https://aws.amazon.com/cloudwatch/)
        browse to  
        `Live Tail` 
        1. Set filtering to: `/aws/lambda/ingestTrigger-<env>`
        2. Click on `Start0`
     4. in a new browser tab, Ingest (upload) a file
        2. Go to the upload page
           1. Give the file a title
           2. Add a new author
           3. Select a file to upload
           4. upload the file
     5. Go back to the cloudwatch tab and check the error message
           1. Copy the user arn from the error message
     6. Back in the OpenSearch Tab
       `Domains -> <amplify-domain> -> Security configuration`
       1. Click on `[Edit]` 
       2. Switch to `Visual editor`
          1. Change **Type** to `IAM ARN`
          2. Paste the User ARN to **Principal**
          3. Set **Action** to `Allow`
       3. Click on `Save changes`
     7. Update file, so the contents will be in OpenSearch. 

---------------------------------------------------


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) TS template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc.) right into your project, so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However, we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

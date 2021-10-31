const { Octokit } = require("@octokit/core");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const main = async () => {

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    let result = await admin.firestore().collection('articles').orderBy('count', 'desc').get();
    let data = [];
    data.push('Blog URL:https://weirenxue.github.io');

    result.forEach((doc) => {
        if (doc.data().count <= 100) return
        data.push(`${doc.data().count}|${doc.id}`);
    })

    const octokit = new Octokit({
        auth: '{PAT}',
    });

    let response = await octokit.request('PATCH /gists/{gist_id}', {
        files: {
            'ranking': {
                content: data.join('\n')
            }
        },
        public: true
    })
    console.log(response.data);
}

main();
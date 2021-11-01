const { Octokit } = require("@octokit/core");
const urljoin = require('url-join');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const main = async () => {

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    let blogUrl = 'https://weirenxue.github.io';
    let result = await admin.firestore().collection('articles').orderBy('count', 'desc').get();
    let data = [];
    data.push(`Blog：[薛惟仁筆記本](${blogUrl})`);

    result.forEach((doc) => {
        if(doc.data().pathname === undefined)
            data.push(`${doc.data().count}｜${doc.id}`);
        else
            data.push(`${doc.data().count}｜[${doc.id}](${urljoin(blogUrl, doc.data().pathname)})`);

    })

    const octokit = new Octokit({
        auth: '{PAT}',
    });

    let response = await octokit.request('PATCH /gists/{gist_id}', {
        files: {
            'ranking.md': {
                content: data.join('  \n')
            }
        },
        public: true
    })
    console.log(response.data);
}

main();
const { Octokit } = require("@octokit/core");
const urljoin = require('url-join');
const admin = require("firebase-admin");

const main = async () => {

    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    let blogUrl = process.env.BLOG_URL;
    let result = await admin.firestore().collection('articles').orderBy('count', 'desc').get();
    let data = [];
    let titlePrefix = process.env.TITLE_PREFIX;
    data.push(`[${titlePrefix}](${blogUrl})`);

    result.forEach((doc) => {
        if(doc.data().pathname === undefined)
            data.push(`${doc.data().count}｜${doc.id}`);
        else
            data.push(`${doc.data().count}｜[${doc.id}](${urljoin(blogUrl, doc.data().pathname)})`);

    })

    const octokit = new Octokit({
        auth: process.env.PAT,
    });

    let response = await octokit.request(`PATCH /gists/${process.env.GIST_ID}`, {
        files: {
            'ranking.md': {
                content: data.join('  \n')
            }
        },
        public: true
    })
}

main();
import * as firebaseAuth from 'firebase/app';

export class userComponents {

    makeLogin (email: string, password: string) {
        firebaseAuth.auth().signInWithEmailAndPassword(email, password).catch ( function (err) {
            var error = err.code;
            var errorMessage = err.errorMessage;
        });
    }

    makeLogout () {

    }
}
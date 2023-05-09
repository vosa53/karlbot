describe("End-to-end tests", () => {
    it("Creates a project, runs it, saves it, creates a challenge and submits the project.", () => {
        const projectName = "Project " + Math.random();

        // Stub Firebase authentication.
        cy.intercept("http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyD-jwb0TF1yCQEJs46OeJt_93FkKOl_a4E",
            { fixture: "firebase.json" });
        cy.intercept("https://localhost:7105/Api/Authentication/Firebase",
            { fixture: "authentication-firebase.json" });
        cy.intercept("https://localhost:7105/Api/Users/Current",
            { fixture: "users-current.json" });
        
        cy.visit("http://localhost:4200");
        cy.window().then(window_ => prepareFirebaseUser(window_));

        cy.contains("Sign in").should("not.exist");

        cy.get(".cm-content").clear();
        cy.get(".cm-editor").type("program toWall\nwhile not wall\nstep\n{backspace}end\n{backspace}end");

        cy.get("mat-form-field").contains("Entry Point").parent().click();
        cy.get("mat-option").contains("toWall").click();

        cy.get("button").contains("Run").click();

        cy.get("button").contains("Run");

        cy.get(".project-name-text").click();

        cy.get("[cdkFocusInitial]").clear();
        cy.get("[cdkFocusInitial]").type(projectName);

        cy.get("button").contains("OK").click();

        cy.get("button").contains("save").parent().click();

        cy.get("a").contains("Projects").click();

        cy.contains(projectName);

        cy.get("a").contains("Challenges").click();

        cy.get("mat-spinner").should("not.exist");

        cy.get("button").contains("Create New").click();

        cy.get("input[ng-reflect-name='name']").type("Some name");
        cy.get("textarea[ng-reflect-name='description']").type("Some description");

        cy.get("mat-form-field").contains("Difficulty").parent().click();
        cy.get("mat-option").contains("Easy").click();

        cy.get("button").contains("Add Test Case").click();

        cy.contains("Test case 1").click();

        cy.get("app-town-editor:nth-child(2) img[src*='karel-tool']").click();

        cy.get("app-town-editor:nth-child(2) app-town-view").click(423, 77);

        cy.get("button").contains("Save").click();

        cy.get("button").contains("Submit Project").click();

        cy.contains(projectName).click();

        cy.contains("Success");
    })
});

// Firebase Authentication JavaScript library loads the current user from indexedDB of the browser. 
// We fake its content here because automated sign in via google popup window is too cumbersome.
function prepareFirebaseUser(window_: Cypress.AUTWindow) {
    const request = window_.indexedDB.open("firebaseLocalStorageDb");

    request.onupgradeneeded = () => {
        request.result.createObjectStore("firebaseLocalStorage", { keyPath: "fbase_key" });
    };
    request.onsuccess = function () {
        const transaction = request.result.transaction("firebaseLocalStorage", "readwrite");
        const store = transaction.objectStore("firebaseLocalStorage");

        store.put({
            fbase_key: "firebase:authUser:AIzaSyD-jwb0TF1yCQEJs46OeJt_93FkKOl_a4E:[DEFAULT]",
            value: {
                uid: "Rphf0bHFSmgscCQxSEQyYrJoKOxb",
                email: "john.doe@gmail.com",
                emailVerified: true,
                isAnonymous: false,
                providerData: [
                    {
                        providerId: "google.com",
                        uid: "4240317620343907012274625335652454110833",
                        displayName: null,
                        email: "john.doe@gmail.com",
                        phoneNumber: null,
                        photoURL: null
                    }
                ],
                stsTokenManager: {
                    refreshToken: "eyJfQXV0aEVtdWxhdG9yUmVmcmVzaFRva2VuIjoiRE8gTk9UIE1PRElGWSIsImxvY2FsSWQiOiJScGhmMGJIRlNtZ3NjQ1F4U0VReVlySm9LT3hiIiwicHJvdmlkZXIiOiJnb29nbGUuY29tIiwiZXh0cmFDbGFpbXMiOnt9LCJwcm9qZWN0SWQiOiJkZW1vLXRlc3QifQ==",
                    accessToken: "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJlbWFpbCI6Imphbi5qb3JrYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXV0aF90aW1lIjoxNjgzNTc2MjM2LCJ1c2VyX2lkIjoiUnBoZjBiSEZTbWdzY0NReFNFUXlZckpvS094YiIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiamFuLmpvcmthQGdtYWlsLmNvbSJdLCJnb29nbGUuY29tIjpbIjQyNDAzMTc2MjAzNDM5MDcwMTIyNzQ2MjUzMzU2NTI0NTQxMTA4MzMiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn0sImlhdCI6MTY4MzU3NjIzNiwiZXhwIjoxNjgzNTc5ODM2LCJhdWQiOiJkZW1vLXRlc3QiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZGVtby10ZXN0Iiwic3ViIjoiUnBoZjBiSEZTbWdzY0NReFNFUXlZckpvS094YiJ9.",
                    expirationTime: 3683579836348
                },
                createdAt: "1679921666667",
                lastLoginAt: "1683576236319",
                apiKey: "AIzaSyD-jwb0TF1yCQEJs46OeJt_93FkKOl_a4E",
                appName: "[DEFAULT]"
            }
        });

        transaction.oncomplete = () => request.result.close();
    }
}
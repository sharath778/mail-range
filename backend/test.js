import Imap from "imap";
import { simpleParser } from "mailparser";


const imapConfig = {
  user: "ssnarayanareddy1126@gmail.com",
  password: "zcki uxrd ttry twwg",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
};

function fetchMostRecentDeleteEmail() {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);

    imap.once("ready", () => {
      imap.openBox("INBOX", false, (err, box) => {
        if (err) {
          imap.end();
          return reject(err);
        }

        imap.search(
          [
            ["FROM", "ssnarayanareddy1126@gmail.com"],
            ["SUBJECT", "DELETE MY ACCOUNT"],
          ],
          (err, results) => {
            if (err) {
              imap.end();
              return reject(err);
            }

            if (results.length === 0) {
              console.log("No matching emails found");
              imap.end();
              return resolve(null);
            }

            const latestEmailUid = results[results.length - 1];

            const fetch = imap.fetch(latestEmailUid, {
              bodies: [""],
              markSeen: false,
            });

            fetch.on("message", (msg) => {
              msg.on("body", (stream) => {
                simpleParser(stream, (err, parsed) => {
                  if (err) {
                    console.error("Error parsing email:", err);
                    imap.end();
                    return reject(err);
                  }

                  console.log("Most recent matching email:");
                  console.log("From:", parsed.from.text);
                  console.log("Subject:", parsed.subject);
                  console.log("Body:");
                  console.log("--------------------");
                  console.log(parsed.text);
                  console.log("--------------------");

                  imap.end();
                  resolve(parsed);
                });
              });
            });

            fetch.once("error", (err) => {
              console.error("Fetch error:", err);
              imap.end();
              reject(err);
            });
          }
        );
      });
    });

    imap.once("error", (err) => {
      console.error("IMAP connection error:", err);
      reject(err);
    });

    imap.once("end", () => {
      console.log("Connection ended");
    });

    imap.connect();
  });
}

fetchMostRecentDeleteEmail()
  .then((result) => {
    if (!result) {
      console.log("No matching emails found in the inbox");
    }
  })
  .catch((error) => {
    console.error("Error fetching email:", error);
  });

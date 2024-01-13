import Layout from "../../components/layout";
import Container from "../../components/container";
import { useRouter } from "next/router";
import fs from "fs";
import path from "path";
import Header from "../../components/header";

type Props = {
  actionsData: any;
  chatgptData: any;
};

export default function ItemPage({ actionsData, chatgptData }: Props) {
  // Now you can use this id to fetch or get your item data
  console.log(actionsData);
  console.log(chatgptData);
  return (
    <Layout>
      <Container>
        <Header />
        <section className="mx-4 mt-4">
          <div className="text-sm font-medium text-stone-600">
            <span>Passed 13-0</span>
            <span> - </span>
            <span>Administrative code</span>
          </div>
          <div className="text-xl font-extrabold">Cash Revolving Funds</div>
        </section>
        <section className="mx-4 mt-4">
          <div className="text-sm text-stone-600">Current state</div>
          <div className="mb-6">{chatgptData['Before Change']}</div>
          <div className="text-sm text-stone-600">Proposed changes</div>
          <div className="mb-6">{chatgptData['Proposed Change']}</div>
          <div className="text-sm text-stone-600">Impact</div>
          <div className="mb-6">{chatgptData['Impact']}</div>
          <div className="text-sm text-stone-600">Rationale</div>
          <div className="mb-6">{chatgptData['Rationale']}</div>
          <div className="text-sm text-stone-600">Approval process</div>
          <div className="mb-6">{chatgptData['Approval Process']}</div>
          <div className="text-sm text-stone-600">Accountability</div>
          <div className="mb-6">{chatgptData['Accountability']}</div>

          <div className="mb-6 p-3 text-xs text-stone-600 border rounded-md">
            This summary was generated by ChatPGT, based on the source text of
            this legislation, which you can find below.
          </div>
        </section>
        <section>
          <div>How the board voted on the latest version</div>
        </section>
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const server = "https://sfgov.s3.us-east-1.amazonaws.com";

  // Construct the URLs using the id from params
  const actionsURL = `${server}/actions/${id}.json`;
  const chatgptURL = `${server}/chatgpt/${id}.json`;

  // Fetch data from each URL
  const actionsData = await fetch(actionsURL).then((res) => res.json());
  const chatgptData = await fetch(chatgptURL).then((res) => res.json());

  // Pass the fetched data to the page via props
  return {
    props: {
      actionsData,
      chatgptData,
    },
  };
}

export async function getStaticPaths() {
  const data = fs.readFileSync(
    path.join(process.cwd(), "_data", "meetings.json"),
    "utf8",
  );
  const urls = JSON.parse(data);

  // Fetch data from each URL
  const meetingsData = await Promise.all(
    urls.map(async (url) => {
      const response = await fetch(url);
      return response.json();
    }),
  );

  //
  // Flatten meetingsData
  const flattenedMeetingsData = [].concat.apply([], meetingsData);
  const fileIds = flattenedMeetingsData.map((data) => data["File #"]);

  const paths = fileIds.map((id) => ({
    params: { id: id.toString() },
  }));

  return { paths, fallback: false };
}

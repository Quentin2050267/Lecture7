async function fetchGraphQLData(url, query, variables={}) {
	const response = await fetch(url, {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
		// Add any additional headers here (e.g., Authorization for protected endpoints)
	  },
	  body: JSON.stringify({
		query,
		// variables: {}, // Uncomment and use if your query requires variables
	  }),
	});
  
	if (!response.ok) {
	  throw new Error(`Network response was not ok: ${response.statusText}`);
	}
  
	const resultjson = await response.json();
	return resultjson.data
  }

class GraphQLAPILecture7 extends React.Component {

	  constructor()
	  {
		super();
		this.state = {anime: []}
	  }
	  componentDidMount()
	  {
		this.loadData()
	  }
	  async loadData()
	  {
		const query = `{
			Page {
			  media {
				siteUrl
				title {
				  english
				  native
				}
				description
			  }
			}
		  }`;
		const data = await fetchGraphQLData ("https://graphql.anilist.co", query)
		console.log(data.Page.media)
		var listofanime = []
		data.Page.media.forEach ( item => {listofanime.push(item.title.english)})
		this.setState({anime: listofanime})
	  }
	  render() {
		      const systemname = "IT5007 Bug Tracker";
		      return (
			            <div>
							<h1>GraphQL API Test</h1>
							{this.state.anime.map((item, pos) =><p key={pos}>{item}</p>)}
						</div>
			          );
		    }
}

const element = <GraphQLAPILecture7 />;

ReactDOM.render(element, document.getElementById('contents'));

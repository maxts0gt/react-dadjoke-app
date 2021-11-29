import React from 'react';
import axios from 'axios';
import { uuid } from 'uuidv4';
import Joke from './Joke';
import './JokeList.css';

class JokeList extends React.Component {
	static defaultProps = {
		numJokesToGet: 10,
	};

	constructor(props) {
		super(props);
		this.state = {
			jokes: JSON.parse(window.localStorage.getItem('jokes') || '[]'),
		};
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		if (this.state.jokes.length === 0) this.getJokes();
	}

	async getJokes() {
		let jokes = [];

		while (jokes.length < this.props.numJokesToGet) {
			let res = await axios.get('https://icanhazdadjoke.com', {
				headers: { Accept: 'application/json' },
			});
			jokes.push({ id: uuid(), text: res.data.joke, votes: 0 });
		}
		this.setState(
			(st) => ({
				jokes: [...st.jokes, ...jokes],
			}),
			() =>
				window.localStorage.setItem(
					'jokes',
					JSON.stringify(this.state.jokes)
				)
		);
	}

	handleVote(id, delta) {
		this.setState(
			(st) => ({
				jokes: st.jokes.map((j) =>
					j.id === id ? { ...j, votes: j.votes + delta } : j
				),
			}),
			() =>
				window.localStorage.setItem(
					'jokes',
					JSON.stringify(this.state.jokes)
				)
		);
	}

	handleClick() {
		this.getJokes();
	}

	render() {
		return (
			<div className='JokeList'>
				<div className='JokeList-sidebar'>
					<h1 className='JokeList-title'>
						<span>Dad</span> Jokes
					</h1>
					<img src='https://img.icons8.com/emoji/96/000000/rolling-on-the-floor-laughing.png' />
					<button
						className='JokeList-getmore'
						onClick={this.handleClick}
					>
						New Jokes
					</button>
				</div>

				<div className='JokeList-jokes'>
					{this.state.jokes.map((j) => (
						<Joke
							key={j.id}
							votes={j.votes}
							text={j.text}
							upvote={() => this.handleVote(j.id, 1)}
							downvote={() => this.handleVote(j.id, -1)}
						/>
					))}
				</div>
			</div>
		);
	}
}

export default JokeList;

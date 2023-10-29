import  * as config from './config.json';

export class GameInstance
{
	private timestamp:		number = 0;
	private started:		boolean = false;
	private finished:		boolean = false;
	private scored:			boolean = false;
	private player1Score:	number = 0;
	private player2Score:	number = 0;
	private round:			number = 1;

	constructor()
	{
		this.timestamp = Date.now();
	}

	public getScore1(): number
	{
		return this.player1Score;
	}

	public getScore2(): number
	{
		return this.player2Score;
	}

	public getRound(): number
	{
		return this.round;
	}

	public addRound(): void
	{
		this.round++;
	}

	public hasScored(): boolean
	{
		return this.scored;
	}

	public notScored(): void
	{
		this.scored = false;
	}

	public setScored(): void
	{
		this.scored = true;
	}

	public getTimeDiff(): number
	{
		return (Date.now() - this.timestamp);
	}

	public scoreP1(): void
	{
		this.player1Score++;
	}

	public scoreP2(): void
	{
		this.player2Score++;
	}

	public whoWon(): number
	{
		if (this.player1Score > config.win)
			return 1;
		if (this.player2Score > config.win)
			return 2;
		return 0;
	}

	public startGame(): void
	{
		this.started = true;
	}

	public isStarted(): boolean
	{
		return this.started;
	}

	public finishGame(): void
	{
		this.finished = true;
	}

	public isFinished(): boolean
	{
		return this.finished;
	}

}
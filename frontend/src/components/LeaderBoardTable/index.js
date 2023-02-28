import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { LeaderBoardScore } from "..";

const LeaderBoardTable = () => {
  const [scores, setScores] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    async function getScores() {
      try {
        let { data } = await axios.get(`http://localhost:3002/api/scores`);
        console.log(data);
        data.sort((a, b) => b.score - a.score);
        setScores(data);
      } catch (err) {
        setError(err.message);
      }
    }
    getScores();
  }, []);

  //Displaying the scores and usernames in leaderboard

  useEffect(() => {
    this.getScores();
  }, [scores]);

  return (
    <>
      <div className="score-container">
        {scores ? (
          scores.map((score) => (
            <LeaderBoardScore key={score.id} score={score} />
          ))
        ) : (
          <h4 id="loading">Loading Scores...</h4>
        )}
      </div>
    </>
  );
};

export default LeaderBoardTable;

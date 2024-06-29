import React from "react";

export default function Progress({index, answer, points, numQuestions, maxPossibolePoints}) {
  return <div className="progress">
    <progress value={index + Number(answer !== null)}  max={numQuestions}/>
    <div>
        
    Questions <strong>{index + 1}</strong> / {numQuestions}
    </div>
    <div>
        
    <strong>{points}</strong> / {maxPossibolePoints}
    </div>
  </div>;
}

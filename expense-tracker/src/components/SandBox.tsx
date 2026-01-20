import React, { useState, type ChangeEvent } from "react";

function SandBox() {
      const [elements, setElements] = useState<number[]>([]);
      console.log("Rendering SandBox component, current elements:", elements);

      return (
            <div>
                  <div>
                        Sorted: {elements.join(",")}
                  </div>
                  <input
                        type="text"
                        placeholder="Enter numbers separated by commas"
                        onChange={(event: ChangeEvent) => {
                              const value = (event.target as HTMLInputElement).value;
                              const array = value.split(",").map((item) => parseInt(item.trim()));
                              setElements(array);
                        }} />
                  <button onClick={() => {
                        console.log("Starting bubble sort...");
                        console.log(`Initial array: ${elements}`);
                        const sortedArray = bubbleSort(elements);
                        console.log(`Sorted array: ${sortedArray}`);
                        setElements(sortedArray);
                  }} >Sort</button>
            </div>
      );
};

function bubbleSort(arr: number[]): Array<number> {
      for (let i = 0; i < (arr.length); i++) {
            for (let j = 0; j < (arr.length - i - 1); j++) {
                  if (arr[j] > arr[j + 1]) {
                        console.log(`Swapping ${arr[j]} and ${arr[j + 1]}`);
                        const temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                  }
                  console.log(`Array after pass ${i}, iteration ${j}: ${arr}`);
            }
      }
      return arr;
};

export default SandBox;

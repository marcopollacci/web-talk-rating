import {
  GetAllEventsRatingMapped,
  GetAllEventsRatingResponse,
} from '../../models/rating.model';

export const mappingRating = (result: GetAllEventsRatingResponse[]) =>
  result.reduce((acc, curr) => {
    const findIdEventIndex = acc.findIndex(
      (el) => el.id_event === curr.id_event
    );
    if (findIdEventIndex === -1) {
      const valueToPush = [curr.value];
      acc.push({
        ...curr,
        value: valueToPush,
        average: calculateAverage(valueToPush),
      });
    } else {
      acc[findIdEventIndex].value.push(curr.value);
      acc[findIdEventIndex].average = calculateAverage(
        acc[findIdEventIndex].value
      );
    }

    return acc;
  }, [] as GetAllEventsRatingMapped[]);

const calculateAverage = (values: string[]) => {
  const sum = values.reduce((acc, curr) => acc + +curr, 0);
  return sum / values.length;
};

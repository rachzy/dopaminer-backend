class DurationDto {
  value: number;
  type: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
}

export class CreateTaskDto {
  title: string;
  difficulty: number;
  date: string;
  duration: DurationDto;
  activity: number;
}

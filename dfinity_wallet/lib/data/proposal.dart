import 'package:hive/hive.dart';

part 'proposal.g.dart';

@HiveType(typeId: 5)
class Proposal extends HiveObject {
  @HiveField(0)
  late String name;
  @HiveField(1)
  late String authorAddress;
  @HiveField(2)
  late DateTime closeDate;

  Proposal(this.name, this.authorAddress, this.closeDate);
}
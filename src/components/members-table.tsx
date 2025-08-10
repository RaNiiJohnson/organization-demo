import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Member } from "@/lib/type";

export default function MembersTable({ members }: { members: Member[] }) {
  return (
    <Table>
      <TableCaption>A list of organization members.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.user.name}</TableCell>
            <TableCell>{member.user.email}</TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell className="text-right">
              {/* <MembersTableAction memberId={member.id} /> */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

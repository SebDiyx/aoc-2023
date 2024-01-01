import networkx as nx

graph = nx.Graph()

f = open('input.txt', 'r')
lines = f.readlines()
for line in lines:
    # line: 'jqt: rhn xhk nvd'
    left, rights = line.strip().split(': ')
    for right in rights.split(' '):
        graph.add_edge(left, right)
        graph.add_edge(right, left)


min_edges = nx.minimum_edge_cut(graph)
graph.remove_edges_from(min_edges)
graph_A, graph_B = nx.connected_components(graph)

print(len(graph_A) * len(graph_B))